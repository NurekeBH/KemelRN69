import React from 'react';
import { View, Text, Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
const WEEK_kk = ['Же', 'Дү', 'Се', 'Сә', 'Бе', 'Жм', 'Сб'];
const WEEK_ru = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
export default ({ lang, weekStartsOn }) => {
  const week_localized = lang == 'kk' ? WEEK_kk : WEEK_ru;
  const weekStartsOnMinnor = weekStartsOn % 7;
  const weekTranformed = [
    ...week_localized.slice(weekStartsOnMinnor),
    ...week_localized.slice(0, weekStartsOnMinnor),
  ];
  return (
    <View
      style={{
        width,
        height: 30,
        flexDirection: 'row',
      }}>
      {weekTranformed.map(day => (
        <View
          style={{
            flex: 1,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
          key={day}>
          <Text
            style={{
              color: 'rgba(0,0,0,0.5)',
              fontSize: 13,
            }}>
            {day}
          </Text>
        </View>
      ))}
    </View>
  );
};
