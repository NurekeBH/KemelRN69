import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { userSelected } from '../../Component/MyIcons';

const ItemUsers = ({
    item,
    isSelected,
    ...params
}) => {

    const [selected, setSelected] = useState(isSelected)


    // useEffect(() => {
    //     item.selected = !item.selected
    // }, [selected]);

    return (
        <TouchableOpacity
            onPress={() => {
                item.selected = !item.selected
                setSelected(!selected)
            }}
            style={{ paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
            <FastImage
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#999999'
                }}
                source={{ uri: item?.avatar }}
            >
                {selected ? userSelected : null}


            </FastImage>
            <View style={{ marginLeft: 10 }}>
                <Text style={{ color: '#000', fontSize: 14, fontWeight: '700' }}>{item?.fio}</Text>
                <Text style={{ color: '#8A8A8D', fontSize: 14, fontWeight: '400' }}>{item?.phone ? item?.phone : item?.email}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ItemUsers;
