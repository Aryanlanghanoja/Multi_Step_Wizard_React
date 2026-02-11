import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface DateInputProps {
  label: string;
  value: string;
  error?: string;
  success?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  format?: string;
  disableFuture?: boolean;
  disablePast?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  shouldDisableDate?: (date: Dayjs) => boolean;
}

const parseDate = (dateString: string): Dayjs | null => {
  if (!dateString || dateString.trim() === "") return null;

  if (dayjs(dateString, "DD/MM/YYYY", true).isValid()) {
    return dayjs(dateString, "DD/MM/YYYY");
  }

  if (dayjs(dateString, "YYYY-MM-DD", true).isValid()) {
    return dayjs(dateString, "YYYY-MM-DD");
  }

  const parsed = dayjs(dateString);
  return parsed.isValid() ? parsed : null;
};

const DateInput = ({
  label,
  value,
  error,
  success = false,
  required = false,
  onChange,
  onBlur,
  format = "DD/MM/YYYY",
  disableFuture = false,
  disablePast = false,
  minDate,
  maxDate,
  shouldDisableDate,
  ...props
}: DateInputProps) => {
  const parsedValue = parseDate(value);

  const handleDateChange = (date: Dayjs | null) => {
    const formattedDate = date ? date.format(format) : "";
    if (onChange) {
      onChange(formattedDate);
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  const getFieldColor = () => {
    if (error) return "error";
    if (success) return "success";
    return undefined;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={required ? `${label} *` : label}
        value={parsedValue}
        onChange={handleDateChange}
        format={format}
        disableFuture={disableFuture}
        disablePast={disablePast}
        minDate={minDate}
        maxDate={maxDate}
        shouldDisableDate={shouldDisableDate}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!error,
            helperText: error,
            color: getFieldColor(),
            onBlur: handleBlur,
          },
        }}
        {...props}
      />
    </LocalizationProvider>
  );
};

export default DateInput;
