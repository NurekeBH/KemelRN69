import { BlurView } from '@react-native-community/blur';
import axios from 'axios';
import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Modal,
  TouchableOpacity,
} from 'react-native';

import { DraxProvider, DraxList } from 'react-native-drax';
import { GetTime, height, width } from '../../Component/Component';
import {
  clock,
  Done,
  draxIcon,
  Priority,
  PurposeIcon,
} from '../../Component/MyIcons';

const renderItem = item => {
  return (
    <View
      style={[
        styles.vwStl,
        {
          width: width - 64,
          paddingVertical: 8,
          backgroundColor: item.done ? '#F2F2F7' : '#fff',
        },
      ]}>
      <View>
        {item?.purpose ? (
          PurposeIcon
        ) : item?.priority ? (
          Priority
        ) : item.done ? (
          <View style={styles.doneStl}>{Done}</View>
        ) : (
          <View
            style={[
              styles.doneStl2,
              {
                borderColor: '#DADADA',
              },
            ]}
          />
        )}
      </View>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text
          style={{
            marginLeft: 14,
            fontSize: 15,
            textDecorationLine: item.done ? 'line-through' : 'none',
            color: item.done ? '#8E8E93' : '#000',
          }}>
          {item.label}
        </Text>
      </View>
      {draxIcon}
    </View>
  );
};

const renderItem2 = item => (
  <View
    style={[
      styles.vwStl,
      {
        width: width - 32,
        paddingVertical: 6,
        backgroundColor: '#fff',
      },
    ]}>
    <View>
      {item.done ? (
        <View style={styles.doneStl}>{Done}</View>
      ) : (
        <View
          style={[
            styles.doneStl2,
            {
              borderColor: item.priority ? '#FF3B30' : '#DADADA',
            },
          ]}
        />
      )}
    </View>

    <View style={{ flex: 1 }}>
      <View style={{ marginLeft: 14 }}>
        <Text
          style={{
            fontSize: 15,
            textDecorationLine: item.done ? 'line-through' : 'none',
            color: item.done ? '#8E8E93' : '#000',
          }}>
          {item.label}
        </Text>
        <View
          style={{
            marginTop: 2,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {clock}
          <Text
            style={{
              fontSize: 12,
              color: '#8E8E93',
              marginLeft: 4,
              textTransform: 'capitalize',
            }}>
            {GetTime(item.datetime, 'DD MMM. YYYY, HH:mm')}
          </Text>
        </View>
      </View>
    </View>
    {draxIcon}
  </View>
);

const ModalDrax = ({ onClose, dataDrax, ind }) => {
  console.log(onClose);
  console.log(ind);
  console.log('dataDrax1', dataDrax);
  const [draxData, setDraxData] = React.useState(dataDrax);
  console.log('dataDrax2', dataDrax);

  const onSave = () => {
    console.log('SAVE3', draxData);

    const idArr = draxData.map(a => a.id);

    let params = {};
    let URL = '';
    if (ind == 1) {
      params.ids = idArr;
      URL = 'todos/tasks/order/';
    } else {
      params.ids = idArr;
      URL = 'todos/habits/order/';
    }
    console.log('SAVE4', params);
    axios
      .post(URL, params)
      .then(response => {
        console.log('SAVE response', response);
      })
      .catch(error => {
        console.log('SAVE error', error.response);
      })
      .finally(() => {
        onClose(false);
      });
  };
  return (
    <BlurView style={{ flex: 1 }} blurRadius={4}>
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, width }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 16,
              marginTop: 10,
              width: '90%'
            }}>
            <TouchableOpacity onPress={() => onClose(false)}>
              <Text style={{ fontSize: 17, color: '#fff', fontWeight: '500' }}>
                Отмена
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave}>
              <Text style={{ fontSize: 17, color: '#fff', fontWeight: '500' }}>
                Готово
              </Text>
            </TouchableOpacity>
          </View>
          <DraxProvider>
            <View style={styles.container}>
              <DraxList
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}
                showsVerticalScrollIndicator={false}
                data={draxData}
                contentContainerStyle={{
                  paddingTop: (height - draxData.length * 45) / 3,
                }}
                renderItemContent={({ item }) =>
                  ind == 2 ? renderItem(item) : renderItem2(item)
                }
                onItemReorder={({ fromIndex, toIndex }) => {
                  const newData = draxData.slice();
                  newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
                  setDraxData(newData);
                }}
                keyExtractor={item => item.id}
              />
            </View>
          </DraxProvider>
        </SafeAreaView>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  alphaItem: {
    marginBottom: 4,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 14,
    flexDirection: 'row',
    width: width - 32,
  },
  vwStl: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#E0E2FF',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  doneStl: {
    width: 24,
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneStl2: {
    width: 24,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
  },
});

export default ModalDrax;
