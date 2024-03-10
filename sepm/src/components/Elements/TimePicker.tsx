import { SyntheticEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TimePickerProps {
  startDate: Date | null;
  handleDateChange: (date: Date, event: SyntheticEvent<any, Event>) => void;
}

const Calendar: React.FC<TimePickerProps> = ({
  startDate,
  handleDateChange,
}) => {
  //   const [startDate, setStartDate] = useState<Date | null>(new Date());

  return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="h:mm aa"
      />
    </div>
  );
};

export default Calendar;
