export function handleInputChange<T extends object>(
  e: React.ChangeEvent<HTMLInputElement>,
  setState: React.Dispatch<React.SetStateAction<T>>,
  fieldName: string,
  formatter?: (value: string) => string
) {
  const input = e.target.value;

  const formattedValue = formatter ? formatter(input) : input;

  setState((prevState: T) => ({
    ...prevState,
    [fieldName]: formattedValue,
  }));
}

export function formatPhone(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');

  // Handle 11-digit numbers (e.g., mobile with country code)
  if (cleaned.length === 12) {
    return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }

  // Handle 10-digit numbers (e.g., landline with country code)
  // if (cleaned.length === 4) {
  //   return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 8)}${cleaned.slice(8)}`;
  // }


  // Handle shorter or incomplete inputs
  // if (cleaned.length > 2) {
  //   return `+${cleaned.slice(0, 2)} (${cleaned.slice(2)}`;
  // }

  return `+${cleaned}`;
}