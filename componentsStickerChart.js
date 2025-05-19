import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';

export default function StickerChart() {
  const [stars, setStars] = useState({});

  useEffect(() => {
    loadStars();
  }, []);

  const loadStars = async () => {
    try {
      const storedStars = await AsyncStorage.getItem('stars');
      if (storedStars) setStars(JSON.parse(storedStars));
    } catch (e) {
      console.error(e);
    }
  };

  const addStar = async (day, task) => {
    const key = `${day}-${task}`;
    const newStars = { ...stars, [key]: (stars[key] || 0) + 1 };
    if (newStars[key] > 2) newStars[key] = 2;
    setStars(newStars);
    await AsyncStorage.setItem('stars', JSON.stringify(newStars));
  };

  return (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <Text style={[styles.tableHeader, styles.tableCell]}>Ziel</Text>
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, index) => (
          <Text key={day} style={[styles.tableHeader, styles.tableCell]}>{day}</Text>
        ))}
      </View>
      {['2 Lernblöcke geschafft', 'Pause gemacht', 'Aufgabe ohne Hilfe'].map((task, taskIndex) => (
        <View key={task} style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.taskCell]}>{task}</Text>
          {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day, dayIndex) => (
            <TouchableOpacity
              key={day}
              style={styles.tableCell}
              onPress={() => addStar(dayIndex + 1, taskIndex + 1)}
            >
              <Text>{'⭐'.repeat(stars[`${dayIndex + 1}-${taskIndex + 1}`] || 0)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}
