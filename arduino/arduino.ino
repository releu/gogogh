int s1 = A0;
int s2 = A1;
int s3 = A3;
int s4 = A5;
char str[30];

void setup() {
  Serial.begin(9600);
}

void loop() {
  *str='\0';
  sprintf(str, "%d,%d,%d,%d;", analogRead(s1), analogRead(s2), analogRead(s3), analogRead(s4));
  Serial.println(str);
 //delay(10);
}

