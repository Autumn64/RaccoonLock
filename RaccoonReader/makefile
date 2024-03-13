CFLAGS = -Wall -Wextra
EXFLAGS = -lssl -lcrypto
CC = gcc
VPATH = src:build

raccoonreader : raccoonreader.o smartstr.c
	$(CC) $(CFLAGS) $^ -o $@ $(EXFLAGS)

build/raccoonreader.o : raccoonreader.c
	mkdir -p build
	$(CC) $(CFLAGS) -c $? -o $@

.PHONY = clean
clean :
	rm -rfv build
