import React, { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import UserApis from "../../redux/services/user/api";
import { Stack, Typography } from "@mui/material";
import { useAppSelector } from "../../redux/hooks";
import { CurrentUserSelector } from "../../redux/slices/auth/selector";

interface Member {
  _id: string;
  username: string;
  level: number;
  firstname: string;
  lastname: string;
}

interface MemberAutocompleteProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  isError: boolean;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
}

const MemberAutocomplete: React.FC<MemberAutocompleteProps> = ({
  members,
  setMembers,
  isError,
  setIsError,
}) => {
  const user = useAppSelector(CurrentUserSelector);

  const [inputValue, setInputValue] = useState<string>("");
  const [options, setOptions] = useState<Member[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [memberSearchTrigger, { isLoading }] =
    UserApis.useLazySearchMemberQuery();

  // Fetch options with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!inputValue.trim() || !user) {
        setOptions([]);
        setError(false);
        setIsError(false);
        return;
      }

      setError(false);

      memberSearchTrigger({ username: inputValue })
        .then((res) => {
          const data: Member[] = res.data?.users.filter((d) => d._id !== user._id) || [];
          setOptions(data);
        })
        .catch(() => {
          setError(true);
          setOptions([]);
        });
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, memberSearchTrigger, setIsError, user]);

  // Handle selection and clear input on select
  const handleChange = (_event: React.SyntheticEvent, newValue: Member[]) => {
    setMembers(newValue);
    setInputValue("");
  };

  return (
    <Stack sx={{ width: "100%" }}>
      <Typography fontWeight={700} gutterBottom>
        Add members
      </Typography>
      <Autocomplete
        multiple
        options={options}
        value={members}
        size="small"
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(_e, v) => setInputValue(v)}
        filterSelectedOptions
        getOptionLabel={(option) =>
          `${option.firstname} ${option.lastname} (${option.username})`
        }
        loading={isLoading}
        noOptionsText={error ? "Error fetching users" : "No users found"}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            placeholder="Search user"
            variant="outlined"
            error={isError || error}
            helperText={
              isError
                ? "At least one member is required"
                : error
                ? "Error fetching users"
                : ""
            }
          />
        )}
      />
    </Stack>
  );
};

export default MemberAutocomplete;
