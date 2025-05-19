import React, { useState, useEffect } from 'react';
import { View, Text, ProgressBarAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [totalStars, setTotalStars] = useState(0);

  useEffect(() => {
    loadRewards();
    loadStars();
  }, []);

  const loadRewards = async () => {
    try {
      const storedRewards = await AsyncStorage.getItem('rewards');
      if (storedRewards) setRewards(JSON.parse(storedRewards));
    } catch (e) {
      console.error(e);
    }
  };

  const loadStars = async () => {
    try {
      const storedStars = await AsyncStorage.getItem('stars');
      if (storedStars) {
        const stars = JSON.parse(storedStars);
        const sum = Object.values(stars).reduce((acc, val) => acc + val, 0);
        setTotalStars(sum);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View>
      <View style={styles.progressBar}>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={totalStars / 30}
          color="#4caf50"
        />
      </View>
      <Text>Fortschritt: {totalStars}/30 Sterne</Text>
      <Text style={styles.subHeader}>Belohnungen</Text>
      <View>
        {rewards.map((reward, index) => (
          <Text key={index} style={styles.rewardItem}>{`${reward.stars} Sterne: ${reward.text}`}</Text>
        ))}
      </View>
    </View>
  );
}
