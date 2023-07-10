export const handelTimeShow = (time) => {
    const today = new Date();
    const todayMinutes = today.getMinutes();
    const todayHours = today.getHours();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    const date = new Date(Number(time));
    const minutes = today.getMinutes();
    const hours = today.getHours();
    const day = date.getDate();
    const mounth = date.getMonth();
    const year = date.getFullYear();

    if (year === todayYear && mounth === todayMonth && todayDate === day && hours === todayHours && minutes === todayMinutes) {
        return `now`;
    }
    if (year === todayYear && mounth === todayMonth && todayDate === day) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    if (year === todayYear && mounth === todayMonth && todayDate !== day && Number(Date.now()) - Number(time) < (7 * 24 * 3600 * 1000)) {
        const options1 = { weekday: 'long' }
        return date.toLocaleDateString('en-US', options1);
    }
    if (year === todayYear && todayDate !== day && (mounth !== todayMonth || Date.now() - time >= (7 * 24 * 3600 * 1000))) {
        const options2 = { month: 'short', day: 'numeric' }
        return date.toLocaleDateString('en-US', options2);
    }
    if (year !== todayYear) {
        return date.toLocaleDateString('en-US', 'YYYY,MM,DD');
    }
}
