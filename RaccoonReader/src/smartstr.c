/*
SMARTSTR.H; A free, open-source, simple, memory-safe and lightweight Strings library for C.
Copyright (c) 2023-2024, Mónica Gómez (Autumn64)

This program is free software: you can redistribute it and/or modify it 
under the terms of the GNU Lesser General Public License as published by 
the Free Software Foundation, either version 3 of the License, or 
(at your option) any later version.

This program is distributed in the hope that it will be useful, 
but WITHOUT ANY WARRANTY; without even the implied warranty of 
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU 
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License 
along with this program. If not, see <https://www.gnu.org/licenses/>. 
*/

#include "smartstr.h"

String str_new(){
	String str;
	str.value = NULL;
	str.length = 0;

	return str;
}

void str_free(String *str){
	if (str->value != NULL){
		free(str->value);
		str->value = NULL;
	}
	str->length = 0;
	return;
}

void str_print(String str){
	for (int i = 0; i < str.length; i++){
		if (str.value[i] == 0) break;
		putc(str.value[i], stdout);
	}
	fflush(stdout);
	return;
}

void str_println(String str){
	for (int i = 0; i < str.length; i++){
		if (str.value[i] == 0) break;
		putc(str.value[i], stdout);
	}
	putc(10, stdout);
	fflush(stdout);
	return;
}

void str_fprint(String str, FILE *stream){
	for (int i = 0; i < str.length; i++){
		if (str.value[i] == 0) break;
		fputc(str.value[i], stream);
	}
	fflush(stream);
	return;
}

void str_fprintln(String str, FILE *stream){
	for (int i = 0; i < str.length; i++){
		if (str.value[i] == 0) break;
		fputc(str.value[i], stream);
	}
	fputc(10, stream);
	fflush(stream);
	return;
}

int str_readln(String *str, FILE *stream){
	char *line = NULL, *tmp = NULL;
	size_t size = 1, index = 0;
	int ch = EOF;

	line = malloc(size);
	if (!line) return STR_FAILURE;

	while (ch){
		ch = getc(stream);
		if (ch == EOF || ch == '\n') ch = 0;

		if (size <= index){
			size *= 2;
			tmp = realloc(line, size);
			if (!tmp) {
				free(line);
				line = NULL;
				return STR_FAILURE;
			}
			line = tmp;
		}
		line[index++] = ch;
	}
	line = realloc(line, index);
	if (!line){
		str->value = NULL;
		str->length = 0;
		return STR_FAILURE;
	}
	str->value = line;
	str->length = index;

	return STR_SUCCESS;
}

int str_scopy(String *dest, String src){
	str_free(dest);
	char *line = NULL;
	line = malloc(src.length);
	if (!line) return STR_FAILURE;
	for (int i = 0; i < src.length; i++){
		line[i] = src.value[i];
	}
	line[src.length - 1] = '\0';
	dest->value = line;
	dest->length = src.length;
	return STR_SUCCESS;
}

int str_ccopy(String *dest, char *src){
	str_free(dest);
	size_t size = strlen(src) != 0 && src[strlen(src) - 1] == 0 || src[strlen(src) - 1] == 10 ? strlen(src) : strlen(src) + 1;
	char *line = NULL;
	line = malloc(size);
	if (!line) return STR_FAILURE;
	for (int i = 0; i < size - 1; i++){
		line[i] = src[i];
	}
	line[size - 1] = '\0';
	dest->value = line;
	dest->length = size;
	return STR_SUCCESS;
}

int str_sappend(String *dest, String src){
	if (dest->length < 1) return STR_FAILURE;
	size_t size = dest->length + src.length - 1;
	size_t index = 0;
	char *line = NULL;
	line = malloc(size);
	if (!line) return STR_FAILURE;
	strncpy(line, dest->value, dest->length);
	for (int i = dest->length - 1; i < size; i++){
		line[i] = src.value[index];
		index++;
	}
	line[size - 1] = '\0';
	str_free(dest);
	dest->value = line;
	dest->length = size;
	return STR_SUCCESS;
}

int str_cappend(String *dest, char *src){
	if (dest->length < 1) return STR_FAILURE;
	size_t sum = strlen(src) != 0 && src[strlen(src) - 1] == 0 || src[strlen(src) - 1] == 10 ? strlen(src) - 1 : strlen(src);
	size_t size = dest->length + sum;
	size_t index = 0;
	char *line = NULL;
	line = malloc(size);
	if (!line) return STR_FAILURE;
	strncpy(line, dest->value, dest->length);
	for (int i = dest->length - 1; i < size; i++){
		line[i] = src[index];
		index++;
	}
	line[size - 1] = '\0';
	str_free(dest);
	dest->value = line;
	dest->length = size;
	return STR_SUCCESS;
}

int str_scomp(String str1, String str2){
	if (str1.length != str2.length) return STR_FALSE;

	for (int i = 0; i < str1.length; i++){
		if (str1.value[i] != str2.value[i]) return STR_FALSE;
	}
	return STR_TRUE;
}

int str_ccomp(String str1, char *str2){
	size_t size = strlen(str2);
	if (str1.length - 1 != size) return STR_FALSE;

	for (int i = 0; i < size; i++){
		if (str1.value[i] != str2[i]) return STR_FALSE;
	}
	return STR_TRUE;
}

size_t str_scount(String str, String pattern){
	size_t count = 0;
	size_t strSize = str.length;
	size_t patternSize = pattern.length - 1;

	if (strSize == 0 || patternSize == 0) return 0;
	if (strSize == 1 || patternSize == 1) return 0;
	if (strSize < patternSize) return 0;

	for (int i = 0; i <= strSize - patternSize; i++){
		if (strncmp(str.value + i, pattern.value, patternSize) == 0){
			count++;
			i += patternSize;
		}
	}
	return count;
}

size_t str_ccount(String str, char *pattern){
	size_t count = 0;
	size_t strSize = str.length;
	size_t patternSize = strlen(pattern);

	if (strSize == 0 || patternSize == 0) return 0;
	if (strSize == 1) return 0;
	if (strSize < patternSize) return 0;

	for (int i = 0; i <= strSize - patternSize; i++){
		if (strncmp(str.value + i, pattern, patternSize) == 0){
			count++;
			i += patternSize;
		}
	}
	return count;
}

long int str_sreplace(String *str, char *pattern, String replacement){
	if (str_ccount(*str, pattern) == 0) return 0;

	size_t count = 0, index = 0;
	size_t rSize = replacement.length == 0 ? replacement.length : replacement.length - 1;
	size_t pSize = strlen(pattern);
	size_t totalSize = str->length + (rSize * str_ccount(*str, pattern)) - (pSize * str_ccount(*str, pattern));
	char *line = malloc(totalSize);
	if (!line) return STR_FAILURE;

	for (int i = 0; i <= totalSize; i++){
		if (strncmp(str->value + index, pattern, pSize) == 0){
			for (int j = 0; j < rSize; j++){
				line[i] = replacement.value[j];
				i++;
			}
			count++;
			index += pSize;
		}
		line[i] = str->value[index];
		index++;
		if (index >= str->length) break;
	}
	line[totalSize - 1] = '\0';
	str_free(str);
	str->value = line;
	str->length = totalSize;

	return count;
}

long int str_creplace(String *str, char *pattern, char *replacement){
	if (str_ccount(*str, pattern) == 0) return 0;

	size_t count = 0, index = 0;
	size_t rSize = strlen(replacement);
	size_t pSize = strlen(pattern);
	size_t totalSize = str->length + (rSize * str_ccount(*str, pattern)) - (pSize * str_ccount(*str, pattern));
	char *line = malloc(totalSize);
	if (!line) return STR_FAILURE;

	for (int i = 0; i <= totalSize; i++){
		if (strncmp(str->value + index, pattern, pSize) == 0){
			for (int j = 0; j < rSize; j++){
				line[i] = replacement[j];
				i++;
			}
			count++;
			index += pSize;
		}
		line[i] = str->value[index];
		index++;
		if (index >= str->length) break;
	}
	line[totalSize - 1] = '\0';
	str_free(str);
	str->value = line;
	str->length = totalSize;

	return count;
}

long int str_remove(String *str, char *pattern){
	if (str_ccount(*str, pattern) == 0) return 0;

	size_t count = 0, index = 0;
	size_t pSize = strlen(pattern);
	size_t totalSize = str->length - (pSize * str_ccount(*str, pattern));
	char *line = malloc(totalSize);
	if (!line) return STR_FAILURE;

	for (int i = 0; i <= totalSize; i++){
		if (strncmp(str->value + index, pattern, pSize) == 0){
			count++;
			index += pSize;
		}
		line[i] = str->value[index];
		index++;
		if (index >= str->length) break;
	}
	line[totalSize - 1] = '\0';
	str_free(str);
	str->value = line;
	str->length = totalSize;

	return count;
}

int str_lower(String *str){
	char *line = NULL;
	size_t size = str->length;
	line = malloc(size);
	if (!line) return STR_FAILURE;
	strncpy(line, str->value, size);
	for (int i = 0; i < size; i++){
		if (line[i] >= 65 && line[i] <= 90) line[i] += 32;
	}
	line[size - 1] = '\0';
	str_free(str);
	str->value = line;
	str->length = size;
	return STR_SUCCESS;
}

int str_upper(String *str){
	char *line = NULL;
	size_t size = str->length;
	line = malloc(size);
	if (!line) return STR_FAILURE;
	strncpy(line, str->value, size);
	for (int i = 0; i < size; i++){
		if (line[i] >= 97 && line[i] <= 122) line[i] -= 32;
	}
	line[size - 1] = '\0';
	str_free(str);
	str->value = line;
	str->length = size;
	return STR_SUCCESS;
}

int str_reverse(String *str){
	char *line = NULL;
	size_t size = str->length;
	size_t index = 0;
	line = malloc(size);
	if (!line) return STR_FAILURE;
	for (int i = size - 2; i >= 0; i--){
		line[index] = str->value[i];
		index++;
	}
	line[size - 1] = '\0';
	str_free(str);
	str->value = line;
	str->length = size;
	return STR_SUCCESS;
}

int str_setvf(String *dest, const char *format, ...){
	char *line = NULL;
	va_list check_size, args;
	size_t size;

	va_start(check_size, format);
	size = vsnprintf(NULL, 0, format, check_size) + 1;
	va_end(check_size);
	line = malloc(size);
	if (!line) return STR_FAILURE;

	va_start(args, format);
	vsnprintf(line, size, format, args);
	va_end(args);
	line[size - 1] = '\0';
	str_free(dest);
	dest->value = line;
	dest->length = size;
	return STR_SUCCESS;
}

int str_charat(String str, size_t index){
	if (index >= str.length) return EOF;

	return str.value[index];
}