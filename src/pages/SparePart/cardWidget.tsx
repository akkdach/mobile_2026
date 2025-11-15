import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';
import { IMenu } from '../../models/menu';
import React from 'react';
import { ScreenWidth } from 'react-native-elements/dist/helpers';


const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    elevation: 2,
  },
  iconWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  textCard: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Prompt-Medium',
  },
});