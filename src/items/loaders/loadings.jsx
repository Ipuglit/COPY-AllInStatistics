import Grid from '@mui/material/Unstable_Grid2';
import Skeleton from '@mui/material/Skeleton';

// ----------------------------------------------------------------------

export default function Loading_Skeletons({type}) {
  return (
    <>
    {
        type == "card" ?
        <>
            <Grid  xs={2} sm={3} md={3.3}>
                <Skeleton width="100%" height="350px" />
            </Grid>
            <Grid  xs={2} sm={3} md={3.3}>
                <Skeleton width="100%" height="350px" />
            </Grid>
            <Grid  xs={2} sm={3} md={3.3}>
                <Skeleton width="100%" height="350px" />
            </Grid>
            <Grid  xs={2} sm={3} md={3.3}>
                <Skeleton width="100%" height="350px" />
            </Grid>
            <Grid  xs={2} sm={3} md={3.3}>
                <Skeleton width="100%" height="350px" />
            </Grid>
            <Grid  xs={2} sm={3} md={3.3}>
                <Skeleton width="100%" height="350px" />
            </Grid>
        </>
        : type == "list" ?
        <>
            <Skeleton width="100%" height="134px" />
            <Skeleton width="100%" height="134px" />
            <Skeleton width="100%" height="134px" />
            <Skeleton width="100%" height="134px" />
            <Skeleton width="100%" height="134px" />
        </>
        : type == "table" ?
        <>
            <Skeleton width="100%" height="52px" />
            <Skeleton width="100%" height="52px" />
            <Skeleton width="100%" height="52px" />
            <Skeleton width="100%" height="52px" />
            <Skeleton width="100%" height="52px" />
        </>
        : type == "table2" ?
        <>
            <Skeleton width="100%" height="82px" />
            <Skeleton width="100%" height="82px" />
            <Skeleton width="100%" height="82px" />
            <Skeleton width="100%" height="82px" />
            <Skeleton width="100%" height="82px" />
        </>
        : type == "table3" ?
        <>
            <Skeleton width="100%" height="102px" sx={{marginTop:'-10px'}} />
            <Skeleton width="100%" height="102px" sx={{marginTop:'-10px'}} />
            <Skeleton width="100%" height="102px" sx={{marginTop:'-10px'}} />
            <Skeleton width="100%" height="102px" sx={{marginTop:'-10px'}} />
            <Skeleton width="100%" height="102px" sx={{marginTop:'-10px'}} />
        </>
        : type == "records" ?
        <>
            <Skeleton width="100%" height="500px" style={{marginTop:'-70px'}} />
        </>
        : type == "single" ?
        <>
            <Skeleton width="100%" height="150px" style={{marginTop:'-50px', borderRadius:'0'}} />
        </>
        : type == "record_data" ?
        <>
            <Skeleton width="100%" height="125px" style={{marginTop:'-25px'}} />
            <Skeleton width="100%" height="500px" style={{marginTop:'-110px'}} />
        </>
        :
        <Skeleton width="100%" height="500px" />
    }

    </>
  );
}

