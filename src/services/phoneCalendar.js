export const phoneCalendar = {
  async addToPhoneCalendar(event) {
    try {
      const formatDateForICS = (date, time) => {
        return date.replace(/-/g, '') + 'T' + time.replace(/:/g, '') + '00';
      };

      const calculateEndDateTime = (date, startTime, duration) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const start = new Date(`${date}T${startTime}`);
        const end = new Date(start.getTime() + (duration || 60) * 60000);
        
        const year = end.getFullYear();
        const month = String(end.getMonth() + 1).padStart(2, '0');
        const day = String(end.getDate()).padStart(2, '0');
        const time = String(end.getHours()).padStart(2, '0') + String(end.getMinutes()).padStart(2, '0') + '00';
        
        return `${year}${month}${day}T${time}`;
      };

      const startDate = formatDateForICS(event.date, event.startTime);
      const endDate = calculateEndDateTime(event.date, event.startTime, event.duration);

      const iCalData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `SUMMARY:${event.title}`,
        `LOCATION:${event.location || ''}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([iCalData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${event.title.replace(/[^a-zа-яё0-9]/gi, '_')}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
      return { success: true };
    } catch (error) {
      console.error('Ошибка:', error);
      return { success: false };
    }
  }
};