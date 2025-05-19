import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Picker, Button, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles';

export default function SettingsScreen({ navigation }) {
  const [childName, setChildName] = useState('');
  const [colorTheme, setColorTheme] = useState('#e0f7fa');
  const [fontSize, setFontSize] = useState('16');
  const [fontFamily, setFontFamily] = useState('Roboto');
  const [rewardText, setRewardText] = useState('');
  const [rewardStars, setRewardStars] = useState('');
  const [rewards, setRewards] = useState([]);
  const [selectedRewards, setSelectedRewards] = useState([]);

  useEffect(() => {
    loadSettings();
    loadRewards();
  }, []);

  const loadSettings = async () => {
    try {
      const name = await AsyncStorage.getItem('childName');
      const color = await AsyncStorage.getItem('colorTheme');
      const size = await AsyncStorage.getItem('fontSize');
      const family = await AsyncStorage.getItem('fontFamily');
      if (name) setChildName(name);
      if (color) setColorTheme(color);
      if (size) setFontSize(size);
      if (family) setFontFamily(family);
    } catch (e) {
      console.error(e);
    }
  };

  const loadRewards = async () => {
    try {
      const storedRewards = await AsyncStorage.getItem('rewards');
      if (storedRewards) setRewards(JSON.parse(storedRewards));
    } catch (e) {
      console.error(e);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('childName', childName);
      await AsyncStorage.setItem('colorTheme', colorTheme);
      await AsyncStorage.setItem('fontSize', fontSize);
      await AsyncStorage.setItem('fontFamily', fontFamily);
    } catch (e) {
      console.error(e);
    }
  };

  const addReward = async () => {
    if (rewardText && rewardStars > 0 && rewardStars <= 30) {
      const newRewards = [...rewards, { text: rewardText, stars: parseInt(rewardStars) }];
      newRewards.sort((a, b) => a.stars - b.stars);
      setRewards(newRewards);
      await AsyncStorage.setItem('rewards', JSON.stringify(newRewards));
      setRewardText('');
      setRewardStars('');
    }
  };

  const toggleRewardSelection = (index) => {
    if (selectedRewards.includes(index)) {
      setSelectedRewards(selectedRewards.filter(i => i !== index));
    } else {
      setSelectedRewards([...selectedRewards, index]);
    }
  };

  const deleteSelectedRewards = async () => {
    const newRewards = rewards.filter((_, index) => !selectedRewards.includes(index));
    setRewards(newRewards);
    setSelectedRewards([]);
    await AsyncStorage.setItem('rewards', JSON.stringify(newRewards));
  };

  const resetRewards = async () => {
    setRewards([]);
    setSelectedRewards([]);
    await AsyncStorage.setItem('rewards', JSON.stringify([]));
  };

  const resetStars = async () => {
    await AsyncStorage.setItem('stars', JSON.stringify({}));
  };

  return (
    <View style={styles.menu}>
      <View style={styles.menuHeader}>
        <TouchableOpacity onPress={() => navigation.closeDrawer()}>
          <MaterialIcons name="close" size={24} color="white" style={styles.closeButton} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Text style={styles.menuTitle}>Einstellungen</Text>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={childName}
          onChangeText={(text) => { setChildName(text); saveSettings(); }}
          placeholder="Dein Name"
        />
        <Text style={styles.label}>Farbe auswählen (Hintergrund):</Text>
        <Picker
          selectedValue={colorTheme}
          onValueChange={(value) => { setColorTheme(value); saveSettings(); }}
          style={styles.picker}
        >
          <Picker.Item label="Blau" value="#e0f7fa" />
          <Picker.Item label="Grün" value="#c8e6c9" />
          <Picker.Item label="Gelb" value="#fff9c4" />
          <Picker.Item label="Pink" value="#fce4ec" />
        </Picker>
        <Text style={styles.label}>Schriftgröße:</Text>
        <Picker
          selectedValue={fontSize}
          onValueChange={(value) => { setFontSize(value); saveSettings(); }}
          style={styles.picker}
        >
          <Picker.Item label="Klein" value="14" />
          <Picker.Item label="Mittel" value="16" />
          <Picker.Item label="Groß" value="18" />
        </Picker>
        <Text style={styles.label}>Schriftart:</Text>
        <Picker
          selectedValue={fontFamily}
          onValueChange={(value) => { setFontFamily(value); saveSettings(); }}
          style={styles.picker}
        >
          <Picker.Item label="Roboto" value="Roboto" />
          <Picker.Item label="Comic Sans" value="ComicSansMS" />
        </Picker>
        <Text style={styles.label}>Neue Belohnung hinzufügen:</Text>
        <TextInput
          style={styles.input}
          value={rewardText}
          onChangeText={setRewardText}
          placeholder="Neue Belohnung (z. B. Eis essen)"
        />
        <TextInput
          style={[styles.input, { width: 80 }]}
          value={rewardStars}
          onChangeText={setRewardStars}
          keyboardType="numeric"
          placeholder="Sterne"
        />
        <Button title="Hinzufügen" onPress={addReward} color="#4caf50" />
        <Text style={styles.label}>Belohnungen löschen:</Text>
        <View>
          {rewards.map((reward, index) => (
            <TouchableOpacity
              key={index}
              style={styles.rewardItem}
              onPress={() => toggleRewardSelection(index)}
            >
              <Text>{selectedRewards.includes(index) ? '☑' : '☐'} {`${reward.stars} Sterne: ${reward.text}`}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Ausgewählte Belohnungen löschen" onPress={deleteSelectedRewards} color="#ef5350" />
        <Button title="Sterne zurücksetzen" onPress={resetStars} color="#ef5350" />
        <Button title="Alle Belohnungen zurücksetzen" onPress={resetRewards} color="#ef5350" />
      </ScrollView>
    </View>
  );
}
