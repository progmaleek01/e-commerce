import React from 'react'
import { TextField, Grid, Input } from '@mui/material'
import {useFormContext, Controller} from 'react-hook-form'




const CustomTextField = ({ name, label}) => {
    const { control } = useFormContext()
    return (
        <Grid item xs={12} sm={6}>
            <Controller
                defaultValue=''
                as={TextField}
                control={control}
                fullWidth
                name={name}
                label={label}
                required
               
            />
        </Grid>

    
  )
}

export default CustomTextField