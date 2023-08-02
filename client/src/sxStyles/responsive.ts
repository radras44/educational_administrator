import { SxProps } from "@mui/material"

export const respHidden = (down: number): SxProps => {
    const sx: SxProps = {
      display: 'block',
      visibility:"visible",
      [`@media (max-width:${down}px)`]: {
        display: 'none',
        visibility: 'hidden'
      },
    };
    return sx;
  };

export const respOrientation = (down : number,initialState : "row" | "column") => {
    const sx :SxProps = {
        display : "flex",
        flexDirection : initialState,
        [`@media (max-width:${down}px)`] : {
            flexDirection : "row"
        }
    }
    return sx
}