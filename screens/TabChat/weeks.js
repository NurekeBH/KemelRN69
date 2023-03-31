import { getLang } from "../../Component/Component";

export const weekArray =
    getLang() == 'kk'
        ? [
            { id: 1, week: 'Дс', acitve: true },
            { id: 2, week: 'Cс', acitve: true },
            { id: 3, week: 'Cс', acitve: true },
            { id: 4, week: 'Бс', acitve: true },
            { id: 5, week: 'Жм', acitve: true },
            { id: 6, week: 'Cб', acitve: true },
            { id: 7, week: 'Жс', acitve: true },
        ]
        : getLang() == 'en'
            ? [
                { id: 1, week: 'Mon', acitve: true },
                { id: 2, week: 'Tue', acitve: true },
                { id: 3, week: 'Wed', acitve: true },
                { id: 4, week: 'Thu', acitve: true },
                { id: 5, week: 'Fri', acitve: true },
                { id: 6, week: 'Sat', acitve: true },
                { id: 7, week: 'Sun', acitve: true },
            ]
            : [
                { id: 1, week: 'Пн', acitve: true },
                { id: 2, week: 'Вт', acitve: true },
                { id: 3, week: 'Cр', acitve: true },
                { id: 4, week: 'Чт', acitve: true },
                { id: 5, week: 'Пт', acitve: true },
                { id: 6, week: 'Cб', acitve: true },
                { id: 7, week: 'Вс', acitve: true },
            ]