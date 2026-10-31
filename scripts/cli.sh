#!/bin/bash
exec node "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/cli.cjs"
