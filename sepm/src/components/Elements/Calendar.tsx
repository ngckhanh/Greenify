import { SyntheticEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TimePickerProps {
  startDate: Date | null;
  handleDateChange: (date: Date, event: SyntheticEvent<any, Event>) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  startDate,
  handleDateChange,
}) => {
  return (
    <div>
      <DatePicker showIcon selected={startDate} onChange={handleDateChange} />
    </div>
  );
};

export default TimePicker;
