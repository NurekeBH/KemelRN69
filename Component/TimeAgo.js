import React, { PropTypes } from 'react'
import {
    View,
    Text
} from 'react-native'
import { GetTime, GetTimeAgo } from './Component'

const format = {
    'kz': {
        years: (t) => `${t}年前`,
        months: (t) => `${t}月前`,
        weeks: (t) => `${t}周前`,
        days: (t) => `${t} күн бұрын`,
        hours: (t) => `${t} сағат бұрын`,
        miniutes: (t) => `${t} м. бұрын`,
        seconds: (t) => `${t} с. бұрын`,
        now: (t) => `қазір`
    },
    "en": {
        years: (t) => `${t} ${t > 1 ? 'years' : 'year'} ago`,
        months: (t) => `${t} ${t > 1 ? 'months' : 'month'} ago`,
        weeks: (t) => `${t} ${t > 1 ? 'weeks' : 'week'} ago`,
        days: (t) => `${t} ${t > 1 ? 'days' : 'day'} ago`,
        hours: (t) => `${t} ${t > 1 ? 'hours' : 'hour'} ago`,
        miniutes: (t) => `${t} ${t > 1 ? 'miniutes' : 'miniute'} ago`,
        seconds: (t) => `${t} ${t > 1 ? 'seconds' : 'second'} ago`,
        now: (t) => 'just now'
    }
}

export default class TimeAgo extends React.Component {
    static defaultProps = {
        language: 'en'
    }

    checkTime = (time) => {

        const { language = 'en' } = this.props
        const formatLanguage = format[language]

        const seconds = Math.floor((new Date() - Date.parse(time)) / 1000)
        let interval = Math.floor(seconds / 31536000)



        if (interval >= 1) return GetTimeAgo(time)

        interval = Math.floor(seconds / 2592000)
        if (interval >= 1) return GetTimeAgo(time)

        interval = Math.floor(seconds / 604800)
        if (interval >= 1) return GetTimeAgo(time)

        interval = Math.floor(seconds / 100000)
        if (interval >= 1) return GetTime(time, 'dd, DD MMMM')


        interval = Math.floor(seconds / 86400)
        if (interval >= 1) return formatLanguage.days(interval)

        interval = Math.floor(seconds / 3600)
        if (interval >= 1) return formatLanguage.hours(interval)

        interval = Math.floor(seconds / 60)
        if (interval >= 1) return formatLanguage.miniutes(interval)

        if (interval >= 1 && interval <= 60) return formatLanguage.seconds(interval)

        return formatLanguage.now()

    }

    render() {
        const { time, language, style } = this.props
        return (
            <Text style={style}>{this.checkTime(time)}</Text>
        )
    }
}

export const dataFormat = (d) => {
    // YYYY-MM-DD HH:mm'
    let yyy = d.getFullYear()
    let MM = d.getMonth() + 1
    let mm = MM < 10 ? "0" + MM : MM
    let dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
    let hh = d.getHours() < 10 ? "0" + d.getHours() : d.getHours()
    let min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()
    return dformat = [yyy,
        mm,
        dd].join('.') + ' ' +
        [hh,
            min].join(':');
}