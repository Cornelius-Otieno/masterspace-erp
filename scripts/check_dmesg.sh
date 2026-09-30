#!/bin/bash
dmesg -T 2>/dev/null | tail -n 60 | grep -iE 'trap|illegal|segfault|protection|chrome|fault'
