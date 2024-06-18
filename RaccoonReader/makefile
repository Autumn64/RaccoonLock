# RaccoonLock; A free, open-source, simple and powerful password manager.
# RaccoonReader; The RaccoonLock's cryptographic module.
# Copyright (c) 2023-2024, Mónica Gómez (Autumn64)
#
# RaccoonReader is free software: you can redistribute it and/or modify it
# under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# RaccoonReader is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.

CFLAGS = -Wall -Wextra
EXFLAGS = -lssl -lcrypto
CC = gcc
VPATH = src:build

all : oldreader raccoonreader

raccoonreader : raccoonreader.o smartstr.c
	$(CC) $(CFLAGS) $^ -o $@ $(EXFLAGS)

build/raccoonreader.o : raccoonreader.c
	mkdir -p build
	$(CC) $(CFLAGS) -c $? -o $@

oldreader : oldreader.o
	$(CC) $(CFLAGS) $^ -o $@ $(EXFLAGS)

build/oldreader.o : oldreader/raccoonreader.c
	mkdir -p build
	$(CC) $(CFLAGS) -c $? -o $@

.PHONY = clean
clean :
	rm -rfv build
	rm -f raccoonreader
	rm -f oldreader
