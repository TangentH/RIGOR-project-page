#!/usr/bin/env python3
"""Export uniformly sampled registered predictions and reference GT in a common display frame.

python scripts/export-comparison.py INPUT.json OUTPUT_DIRECTORY
Requires numpy and plyfile. Input contains scenes with id, label, run and
clouds (method id -> source PLY), plus optional metrics keyed by method id.
Reference GT must already be in the same evaluation coordinate frame.
Reference GT is represented by all occupied 30 cm voxel centers
and displayed in uniform gray. Exact sub-voxel positions are not exported.
"""
import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from plyfile import PlyData, PlyElement

METHODS = {'gt': 'LiDAR GT', 'ours': 'Ours', 'panovggt': 'PanoVGGT', 'da3-sequential': 'DA3-Sequential',
           'vggt-slam2': 'VGGT-SLAM2', 'mast3r-slam': 'MASt3R-SLAM',
           'patchmatch': 'PatchMatch', 'vggt': 'VGGT'}
BUDGET = 1_000_000
GT_VOXEL_METERS = 0.30
LIGHT = 180_000
SEED = 2027


def digest(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as stream:
        while block := stream.read(8 << 20): h.update(block)
    return h.hexdigest()


def load(path, reference=False):
    data = PlyData.read(path)['vertex'].data
    xyz = np.column_stack([data[k] for k in ['x', 'y', 'z']])
    if not np.isfinite(xyz).all(): raise ValueError('Nonfinite source coordinates')
    if all(k in data.dtype.names for k in ['red', 'green', 'blue']):
        rgb = np.column_stack([data[k] for k in ['red', 'green', 'blue']])
    elif reference:
        rgb = np.full((len(xyz), 3), 145, dtype=np.uint8)
    else:
        raise ValueError('Prediction source must contain RGB')
    return xyz, rgb


def coarse_reference(xyz):
    occupied = set()
    for start in range(0, len(xyz), 1_000_000):
        keys = np.unique(np.floor(xyz[start:start + 1_000_000] / GT_VOXEL_METERS).astype(np.int32), axis=0)
        occupied.update(map(tuple, keys))
    keys = np.array(sorted(occupied), dtype=np.int32)
    return (keys.astype(np.float64) + 0.5) * GT_VOXEL_METERS


def main():
    config = json.loads(Path(sys.argv[1]).read_text())
    out = Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
    scenes = []
    for spec in config['scenes']:
        clouds = spec['clouds']
        if clouds.keys() - METHODS.keys(): raise ValueError('Unsupported method')
        if not {'gt', 'ours'} <= clouds.keys(): raise ValueError('Real GT and Ours required')
        xyz, _ = load(clouds['ours'])
        origin = (xyz.min(0) + xyz.max(0)) / 2
        radius = float(np.linalg.norm(xyz - origin, axis=1).max())
        scene = {k: spec[k] for k in ['id', 'run']}
        floor, date, run = spec['run'].split('/')
        scene['label'] = f"Floor {floor.removeprefix('floor_')} · {date} · Run {run.removeprefix('run_')}"
        scene.update(origin=origin.tolist(), radius=radius, methods=[])
        hashes = set()
        for method, path in clouds.items():
            source_hash = digest(path)
            if source_hash in hashes: raise ValueError('Duplicate clouds assigned to different methods')
            hashes.add(source_hash)
            xyz, rgb = load(path, reference=method == 'gt')
            source_count = len(xyz)
            if method == 'gt':
                xyz = coarse_reference(xyz)
                rgb = np.full((len(xyz), 3), 145, dtype=np.uint8)
            count = len(xyz)
            # Random vertex order permits uniform drawRange during interaction.
            idx = np.random.default_rng(SEED).choice(count, count if method == 'gt' else min(BUDGET, count), replace=False)
            xyz = (xyz[idx] - origin)[:, [0, 2, 1]] * [1, 1, -1]
            vertex = np.empty(len(idx), dtype=[('x','<f4'),('y','<f4'),('z','<f4'),
                                               ('red','u1'),('green','u1'),('blue','u1')])
            for i,k in enumerate(['x','y','z']): vertex[k] = xyz[:,i]
            for i,k in enumerate(['red','green','blue']): vertex[k] = rgb[idx,i]
            base = f"{spec['id']}-{method}"
            full = out / f'{base}-detail.ply'; light = out / f'{base}.ply'
            exports = [(light, vertex if method == 'gt' else vertex[:LIGHT])]
            if method != 'gt' and len(vertex) > LIGHT: exports.append((full, vertex))
            for target, values in exports:
                PlyData([PlyElement.describe(values, 'vertex')], text=False, byte_order='<').write(target)
            record = dict(id=method,label=METHODS[method],url=f'/media/comparison/{light.name}',
                          sourcePoints=source_count,
                          previewPoints=len(vertex) if method == 'gt' else min(LIGHT,len(vertex)),detailPoints=len(vertex),
                          sourceSha256=source_hash,sha256=digest(light))
            if method != 'gt' and len(vertex) > LIGHT:
                record.update(detailUrl=f'/media/comparison/{full.name}',detailSha256=digest(full))
            if method in spec.get('notes',{}): record['note']=spec['notes'][method]
            if method in spec.get('metrics',{}):record['metrics']=spec['metrics'][method]
            if method == 'gt':
                record['note'] = 'Reference LiDAR · coarse 30 cm grid · visualization only'
                record['visualization'] = dict(voxelSizeMeters=GT_VOXEL_METERS,
                    coordinateRepresentation='occupied voxel centers, no original sub-voxel positions',
                    occupiedVoxels=count, pointBudget=None, gridOrigin=[0, 0, 0])
            scene['methods'].append(record)
            print(spec['id'], method, count, '->', len(vertex), flush=True)
        scenes.append(scene)
    manifest = dict(initialPointBudget=LIGHT,pointBudget=BUDGET,seed=SEED,
                    protocol='Reference GT and registered predictions, evaluation ROI; common display origin and rotation; uniform sampling, no independent centering, rescaling, denoising or synthetic points.',scenes=scenes)
    (out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')


if __name__ == '__main__': main()
