import * as React from 'react';
import {useState} from 'react';
import {entityToPath, getDefaultEntityValue, getStorage} from "../Utils"
import {
    Chip,
    IconButton,
    InputAdornment,
    Stack,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Tooltip,
    tooltipClasses,
    TooltipProps,
    Typography
} from '@mui/material';
import {globalSearch} from "../QueryHelpers";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import Link from "@mui/material/Link";

function SearchExploreView(props: any) {

    const [stixObjects, setStixObjects] = useState<any[]>([]);
    const [value, setValue] = useState('');

    const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))({
        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: 800,
            fontSize: '13px'
        },
    });

    const search = (value: string) => {
        getStorage().then((storage: any) => {
            globalSearch(value, storage).then((response: any) => {
                const stixCoreObjects = response['data']['stixCoreObjects']['edges'].map((item: any) => {
                    item.node.link = storage['opencti_url'] + entityToPath(item.node.entity_type) + '/' + item.node.id;
                    return item;
                });
                setStixObjects(stixCoreObjects);

            }).catch((err) => {
                console.log(err);
            });
        });
    };

    const handleSearchEnter = (event: any) => {
        if(event.keyCode === 13){
            search(value);
        }
    };

    function renderGlobalSearchResult() {
        if (stixObjects.length > 0) {
            return (
                <TableContainer>
                    <Table>
                        <TableBody>
                            {stixObjects.map((row: any) => (
                                <TableRow
                                    key={row.node.id}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell sx={{width: "10%"}} component="th" scope="row">
                                        <Chip sx={{borderRadius: 0}} label={row?.node.entity_type?.toUpperCase()}
                                              className={`bg-icon bg-${row?.node.entity_type?.toLowerCase()}`}/>
                                    </TableCell>
                                    <TableCell>
                                        <Link sx={{textDecoration: "none"}} href={row.node.link} rel="noreferrer" target="_blank">{getDefaultEntityValue(row.node)}</Link>
                                    </TableCell>
                                    {/*
                                    <TableCell>
                                        <CustomWidthTooltip title={row?.node.description}>
                                            <IconButton>
                                                <InfoOutlinedIcon />
                                            </IconButton>
                                        </CustomWidthTooltip>
                                    </TableCell>*/}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        }
        else {
            return (
                <Typography sx={{p: 1}} variant="body2">No objects found</Typography>
            )
        }
    }

    React.useEffect(() => {
        if (props.searchValue){
            setValue(props.searchValue);
            search(props.searchValue);
        }
    }, [props.searchValue]);

    return (
        <Stack sx={{ width: '100%', p: 2}} spacing={2}>
            <TextField
                placeholder="Search in OpenCTI"
                type="text"
                variant="outlined"
                onChange={(e) => setValue(e.target.value)}
                value={value}
                fullWidth={true}
                onKeyDown={handleSearchEnter}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchOutlinedIcon />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <IconButton onClick={() => setValue("")}>
                            {value.length > 0 ? <CloseOutlinedIcon/> : ''}
                        </IconButton>
                    )
                }}
            />
            {renderGlobalSearchResult()}
        </Stack>
    )
}

export default SearchExploreView;
