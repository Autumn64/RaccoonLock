//Made by Aurora Giselle Flores Gomez (Autumn64)
#ifndef NSTDOI_H_INCLUDED
#define NSTDOI_H_INCLUDED

#include<stdio.h>
#include<string.h>

char* unnchar(char * str){
	if (strlen(str) > 1 && str[strlen(str) - 1] == '\n' ){	
		str[strlen(str) - 1] = '\0';
	}
	return str;
}

void cleanstd(){
	while(getchar() != '\n' && getchar() != EOF);
	return;
}

#endif // NSTDOI_H_INCLUDED
