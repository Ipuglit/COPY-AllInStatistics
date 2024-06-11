import Grid from '@mui/material/Unstable_Grid2';
import Skeleton from '@mui/material/Skeleton';

// ----------------------------------------------------------------------

export default function Loading_Skeletons({type}) {
  return (
    <>
    {
        type == "card" ?
        <>
            <Grid  xs={2} sm={3} md={4}>
                <Skeleton width="100%" height="300px" />
            </Grid>
            <Grid  xs={2} sm={3} md={4}>
                <Skeleton width="100%" height="300px" />
            </Grid>
            <Grid  xs={2} sm={3} md={4}>
                <Skeleton width="100%" height="300px" />
            </Grid>
            <Grid  xs={2} sm={3} md={4}>
                <Skeleton width="100%" height="300px" />
            </Grid>
            <Grid  xs={2} sm={3} md={4}>
                <Skeleton width="100%" height="300px" />
            </Grid>
        </>
        : type == "list" ?
        <>
            <Skeleton width="100%" height="94px" />
            <Skeleton width="100%" height="94px" />
            <Skeleton width="100%" height="94px" />
            <Skeleton width="100%" height="94px" />
            <Skeleton width="100%" height="94px" />
        </>
        : type == "table" ?
        <>
            <Skeleton width="100%" height="52px" />
            <Skeleton width="100%" height="52px" />
            <Skeleton width="100%" height="52px" />
            <Skeleton width="100%" height="52px" />
            <Skeleton width="100%" height="52px" />
        </>
        :
            <Skeleton width="100%" height="500px" />
    }

    </>
  );
}

