import React, { PropTypes } from 'react'
import {
    View,
    Text
} from 'react-native'
import moment from 'moment';

const format = {
    'kz': {
        today: () => `бүгін`,
        tomorrow: () => `кеше`,
    },
    "en": {
        today: (t) => `today`,
        tomorrow: () => `tomorrow`,
    },
    "ru": {
        today: (t) => `сегодня`,
        tomorrow: () => `вчера`,
    }
}


export default class TimeAgoDay extends React.Component {
    static defaultProps = {
        language: 'kz'
    }


    checkTime = (time) => {
        const { language = 'kz' } = this.props
        const today = moment().startOf('day');
        const tomorrow = moment().startOf('day').add(-1, 'day');
        const targetDate = moment(time);

        const formatLanguage = format[language]


        let timeAgoText = '';

        if (targetDate.isSame(today, 'day')) {
            timeAgoText = formatLanguage.today()
        } else if (targetDate.isSame(tomorrow, 'day')) {
            timeAgoText = formatLanguage.tomorrow()
        } else {
            timeAgoText = targetDate.format('MMMM D'); // Format as "Month Day"
        }

        return timeAgoText

    }

    render() {
        const { time, language, style } = this.props
        return (
            <Text style={style}>{this.checkTime(time)}</Text>
        )
    }
}