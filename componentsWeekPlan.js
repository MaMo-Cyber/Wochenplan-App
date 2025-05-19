import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Picker } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';

const defaultPlan = [
  ['Schule', 'Hausaufgaben, Lernblock 1+2', 'Ruhige Spielzeit'],
  ['Schule', 'Konzentrationstraining / Sport', 'Hörspiel / Lesen'],
  ['Schule', 'Freizeit (Highlight!)', 'Gesellschaftsspiel'],
  ['Schule', 'Lernblock + Kreativzeit', 'Malen / Basteln'],
  ['Schule', 'Spielplatz / Freizeit', 'Kinonachmittag zuhause'],
  ['Haushalt helfen', 'Ausflug / Spielen', 'Wochenrückblick + Belohnung'],
  ['Entspannen', 'Gesellschaftsspiel / Spaziergang', 'Vorbereiten auf Montag']
];

export default function WeekPlan() {
  const [plan, setPlan] = useState(defaultPlan);
  const [colors, setColors] = useState({});

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      const storedPlan = await AsyncStorage.getItem('weekPlan');
      const storedColors = await AsyncStorage.getItem('weekPlanColors');
      if (storedPlan) setPlan(JSON.parse(storedPlan));
      if (storedColors) setColors(JSON.parse(storedColors));
    } catch (e) {
      console.error(e);
    }
  };

  const savePlan = async (row, col, value) => {
    const newPlan = [...plan];
    newPlan[row][col - 1] = value;
    setPlan(newPlan);
    await AsyncStorage.setItem('weekPlan', JSON.stringify(newPlan));
  };

  const saveColor = async (row, col, color) => {
    const newColors = { ...colors, [`${row}-${col}`]: color };
    setColors(newColors);
    await AsyncStorage.setItem('weekPlanColors', JSON.stringify(newColors));
  };

  return (
    <ScrollView horizontal>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeader, styles.tableCell]}>Tag</Text>
          <Text style={[styles.tableHeader, styles.tableCell]}>Morgens</Text>
          <Text style={[styles.tableHeader, styles.tableCell]}>Nachmittags</Text>
          <Text style={[styles.tableHeader, styles.tableCell]}>Abends</Text>
        </View>
        {['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'].map((day, row) => (
          <View key={day} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.dayCell]}>{day}</Text>
            {[1, 2, 3].map(col => (
              <View key={col} style={styles.tableCell}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors[`${row}-${col}`] || 'white' }]}
                  value={plan[row][col - 1]}
                  onChangeText={(text) => savePlan(row, col, text)}
                />
                <Picker
                  selectedValue={colors[`${row}-${col}`] || '#ffffff'}
                  onValueChange={(value) => saveColor(row, col, value)}
                  style={{ width: 100 }}
                >
                  <Picker.Item label="Weiß" value="#ffffff" />
                  <Picker.Item label="Hellblau" value="#e0f7fa" />
                  <Picker.Item label="Hellgrün" value="#c8e6c9" />
                  <Picker.Item label="Gelb" value="#fff9c4" />
                  <Picker.Item label="Pink" value="#fce4ec" />
                </Picker>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
