import axios from 'axios';
import React, { Component } from 'react';
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { getLang } from '../../Component/Component';
import Header from '../../Component/Header2';
import { Left, Right, WeekIcon } from '../../Component/MyIcons';
import { strings } from '../../Localization/Localization';


const getLabel = (label) => {
  switch (label) {
    case 'Руханият': return 'Духовный интеллект';
    case 'Интелектуалдық даму': return 'Интеллектуальный интеллект';
    case 'Отбасы': return 'Семья';
    case 'Қаржы тәуелсіздігі': return 'Финансовый независимость';
    case 'Денсаулық': return 'Здоровья';
    case 'Қарым-қатынас': return 'Отношение';
    case 'Қоғамдық жұмыс': return 'Общественные дела';
    case 'Хобби': return 'Хобби/Отдых';
    case '3 ай': return '3 месяц';
    case '6 ай': return '6 месяц';
    case '1 жыл': return '1 год';
    case '3 жыл': return '3 года';
    case '5 жыл': return '5 года';

    default: return '';
  }
}

export default class MyGoals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      goalCate: [],
      selectedIndex: 0,
      section_id: null,
      section: [],
      isLoadingS: true,
    };
  }

  componentDidMount() {
    this.GetSection();
    this.GetCategory();
  }
  GetSection() {
    axios
      .get('goals/section/?sorting=sort')
      .then(response => {
        console.log('RESPONSE section:', response);

        let section = response.data.sort((a, b) => (a.sort > b.sort) ? 1 : -1)
        this.setState({
          section: section,
          section_id: section[0].id,
          isLoadingS: false,
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        });
      });
  }

  GetCategory() {
    axios
      .get('goals/category/?sorting=sort')
      .then(response => {
        console.log('RESPONSE category:', response);
        let category = response.data.sort((a, b) => (a.sort > b.sort) ? 1 : -1)

        this.setState({
          goalCate: category,
          isLoading: false,
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        });
      });
  }

  renderItemCat = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          width: 85,
          height: 25,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: this.state.selectedIndex == index ? 'white' : null,
        }}
        onPress={() => {
          this.setState({
            selectedIndex: index,
            section_id: item.id,
          });
        }}>
        <Text style={{ fontWeight: '600', fontSize: 13 }}>{getLang() == 'kk' ? item.label : getLabel(item.label)}</Text>
      </TouchableOpacity>
    );
  };

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          borderRadius: 12,
          marginHorizontal: 16,
          marginTop: 8,
          padding: 16,
          borderBottomColor: '#8E8E93',
          borderBottomWidth: 0.5,
        }}
        onPress={() => {
          this.props.navigation.navigate('Goals', {
            category_id: item.id,
            section_id: this.state.section_id,
            label: item.label,
          });
        }}>
        <Text style={{ flex: 1, fontSize: 17 }}>{getLang() == 'kk' ? item.label : getLabel(item.label)}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ fontSize: 17, color: 'grey', marginRight: 8 }}>
            {item.total_task}
          </Text>
          {Right}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { goalCate, section } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Header
            title={strings.mygoals}
            onLeftPress={() => this.props.navigation.goBack()}
          />
          <View
            style={{
              backgroundColor: '#D8D8DC',
              marginHorizontal: 16,
              borderRadius: 8,
              padding: 2,
            }}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={section}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItemCat}
            />
          </View>

          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <FlatList
              data={goalCate}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItem}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
