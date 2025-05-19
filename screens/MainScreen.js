import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import WeekPlan from '../components/WeekPlan';
import StickerChart from '../components/StickerChart';
import Rewards from '../components/Rewards';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../styles';

export default function MainScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <MaterialIcons name="settings" size={30} color="white" />
      </TouchableOpacity>
      <ScrollView>
        <Text style={styles.header}>Wochenplan für dein Kind</Text>
        <WeekPlan />
        <Text style={styles.subHeader}>Stickerkarte</Text>
        <StickerChart />
        <Text style={styles.subHeader}>Wochenbelohnung</Text>
        <Rewards />
      </ScrollView>
    </View>
  );
}
