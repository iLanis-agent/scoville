#!/usr/bin/env python3
"""Scoville oracle: independent python recompute of blend/dilute/level/equivalent."""
import json, os

PEPPERS = {
 'bell': (0,0), 'poblano': (1000,2000), 'jalapeno': (2500,8000),
 'sriracha': (1000,2500), 'tabasco': (2500,5000), 'serrano': (10000,23000),
 'cayenne': (30000,50000), 'thai': (50000,100000), 'habanero': (100000,350000),
 'scotch': (100000,350000), 'ghost': (855000,1041427), 'scorpion': (1200000,2000000),
 'reaper': (1400000,2200000),
}
LEVELS = [(0,'No heat'),(500,'Trace'),(2500,'Mild'),(10000,'Medium'),
          (50000,'Hot'),(150000,'Very hot'),(600000,'Extreme'),(float('inf'),'Superhot')]

def level(shu):
    for m, l in LEVELS:
        if shu <= m: return l
    return LEVELS[-1][1]

def blend(rows):
    total = heat = 0
    for pid, g in rows:
        if pid not in PEPPERS or not g > 0: continue
        lo, hi = PEPPERS[pid]
        total += g; heat += (lo+hi)/2 * g
    if total == 0: return None
    shu = heat/total
    return {'shu': round(shu), 'level': level(shu), 'totalGrams': total}

def dilute(shu, mg, dg):
    if not shu >= 0 or not mg > 0 or not dg > 0: return None
    f = shu*mg/(mg+dg)
    return {'shu': round(f), 'level': level(f)}

def equivalent(shu):
    best, bd = None, float('inf')
    for pid,(lo,hi) in PEPPERS.items():
        m = (lo+hi)/2
        d = abs(m-shu)/(m+1)
        if d < bd: bd, best = d, pid
    return best

items = []
for rows in [[('jalapeno',100)],[('jalapeno',50),('habanero',50)],
             [('bell',200),('ghost',5)],[('reaper',10),('poblano',300)],
             [('bell',0),('nope',10)],[('cayenne',25),('thai',25),('serrano',50)]]:
    items.append({'kind':'blend','rows':rows,'oracle':blend(rows)})
for shu, mg, dg in [(350000,5,500),(5250,30,270),(0,50,500),(948213,2,1000),(40000,100,0)]:
    items.append({'kind':'dilute','shu':shu,'mg':mg,'dg':dg,'oracle':dilute(shu,mg,dg)})
for shu in [0,300,4000,40000,200000,948213,1800000,2500000]:
    items.append({'kind':'level','shu':shu,'oracle':level(shu)})
    items.append({'kind':'equivalent','shu':shu,'oracle':equivalent(shu)})
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'expected.json')
json.dump({'items': items}, open(out,'w'))
print('cases:', len(items))
