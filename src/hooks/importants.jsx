export const TimeZoned = Intl.DateTimeFormat().resolvedOptions().timeZone;

const LocIP                                 = import.meta.env.VITE_GO_LOC

export const Fetch = {
                        users:              LocIP+import.meta.env.VITE_GET_USERS,
                        userslist:          LocIP+import.meta.env.VITE_GET_USERSLIST,
                        userz:              LocIP+import.meta.env.VITE_GET_USERZ,
                        myaccounts:         LocIP+import.meta.env.VITE_GET_MYACCOUNTS,
                        accounts:           LocIP+import.meta.env.VITE_GET_ACCOUNTS,
                        accountslist:       LocIP+import.meta.env.VITE_GET_ACCOUNTSLIST,
                        accountsupline:     LocIP+import.meta.env.VITE_GET_ACCOUNTS_UPLINE,
                        announcementlist:   LocIP+import.meta.env.VITE_GET_ANNOUNCELIST,
                        applications:       LocIP+import.meta.env.VITE_GET_APPS,
                        applicationslist:   LocIP+import.meta.env.VITE_GET_APPSLIST,
                        myclubs:            LocIP+import.meta.env.VITE_GET_MYCLUBS,
                        clubs:              LocIP+import.meta.env.VITE_GET_CLUBS,
                        clubslist:          LocIP+import.meta.env.VITE_GET_CLUBSLIST,
                        clubz:              LocIP+import.meta.env.VITE_GET_CLUBZ,
                        historylist:        LocIP+import.meta.env.VITE_GET_HISTORYLIST,
                        history:            LocIP+import.meta.env.VITE_GET_HISTORY,
                        myhistory:          LocIP+import.meta.env.VITE_GET_MYHISTORY,
                        notification:       LocIP+import.meta.env.VITE_GET_NOTIFICATION,
                        notification_count: LocIP+import.meta.env.VITE_GET_NOTIFICATION_COUNT,
                        authenticate:       LocIP+import.meta.env.VITE_GET_AUTHENTICATE,
                        profile:            LocIP+import.meta.env.VITE_GET_PROFILE,
                        images:             LocIP+import.meta.env.VITE_GET_IMAGES,
                        deals:              LocIP+import.meta.env.VITE_GET_DEALS,
                        unions:             LocIP+import.meta.env.VITE_GET_UNIONS,
                        company:            LocIP+import.meta.env.VITE_GET_COMPANY,
                        games:              LocIP+import.meta.env.VITE_GET_GAMES,
                        roles:              LocIP+import.meta.env.VITE_GET_ROLES,
                        roleslist:          LocIP+import.meta.env.VITE_GET_ROLESLIST,
                        rolez:              LocIP+import.meta.env.VITE_GET_ROLEZ,
                        roleusers:          LocIP+import.meta.env.VITE_GET_ROLEUSERS,
                        uplines:            LocIP+import.meta.env.VITE_GET_UPLINES,
                        uplines2:           LocIP+import.meta.env.VITE_GET_UPLINES2,
                        fxUSD:              LocIP+import.meta.env.VITE_GET_FXUSD,
                        fxUSDlist:          LocIP+import.meta.env.VITE_GET_FXUSDLIST,
                        fxrates:            LocIP+import.meta.env.VITE_GET_FXRATES,
                        exchangerates:      LocIP+import.meta.env.VITE_GET_EXCHANGERATE,
                        records:            LocIP+import.meta.env.VITE_GET_RECORDS,
                        recordslist:        LocIP+import.meta.env.VITE_GET_RECORDSLIST,
                        recordsnew:         LocIP+import.meta.env.VITE_GET_RECORDSNEW,
                        formula:            LocIP+import.meta.env.VITE_GET_FORMULA,
                        dealhistory:        LocIP+import.meta.env.VITE_GET_DEALHISTORY,
                        dealplayers:        LocIP+import.meta.env.VITE_GET_DEALPLAYERS,
                        dealuplines:        LocIP+import.meta.env.VITE_GET_DEALUPLINES,
                        dealformula:        LocIP+import.meta.env.VITE_GET_DEALFORMULA,
                        chart_counting:     LocIP+import.meta.env.VITE_CHART_COUNTING,
                        chart_records:      LocIP+import.meta.env.VITE_CHART_RECORDS,
                    };

export const URL = {
                        fxusd1:             LocIP+import.meta.env.VITE_URL_FXUSD1,
                        fxusd2:             LocIP+import.meta.env.VITE_URL_FXUSD2,
                        fxusd3:             LocIP+import.meta.env.VITE_URL_FXUSD3,
                    };

export const API = {
                        fxusd1API:          LocIP+import.meta.env.VITE_API_FXUSD1,
                    };

export const Upsert = {
                        login:              LocIP+import.meta.env.VITE_GO_LOGIN,
                        users:              LocIP+import.meta.env.VITE_UPSERT_USERS,
                        accounts:           LocIP+import.meta.env.VITE_UPSERT_ACCOUNTS,
                        applications:       LocIP+import.meta.env.VITE_UPSERT_APPS,
                        clubs:              LocIP+import.meta.env.VITE_UPSERT_CLUBS,
                        unions:             LocIP+import.meta.env.VITE_UPSERT_UNIONS,
                        uplines:            LocIP+import.meta.env.VITE_UPSERT_UPLINES,
                        profile:            LocIP+import.meta.env.VITE_UPSERT_PROFILE,
                        exchangerate:       LocIP+import.meta.env.VITE_UPSERT_EXCHANGERATE,
                        records:            LocIP+import.meta.env.VITE_UPSERT_RECORDS,
                    };

export const Upserts = {
                        login:              LocIP+import.meta.env.VITE_GO_LOGIN,
                        users:              LocIP+import.meta.env.VITE_UPSERTS_USERS,
                        useraccounts:       LocIP+import.meta.env.VITE_UPSERTS_USERACCOUNTS,
                        accounts:           LocIP+import.meta.env.VITE_UPSERTS_ACCOUNTS,
                        applications:       LocIP+import.meta.env.VITE_UPSERTS_APPS,
                        clubs:              LocIP+import.meta.env.VITE_UPSERTS_CLUBS,
                        unions:             LocIP+import.meta.env.VITE_UPSERTS_UNIONS,
                        uplines:            LocIP+import.meta.env.VITE_UPSERTS_UPLINES,
                        profile:            LocIP+import.meta.env.VITE_UPSERTS_PROFILE,
                        exchangerate:       LocIP+import.meta.env.VITE_UPSERTS_EXCHANGERATE,
                        csvupload:          LocIP+import.meta.env.VITE_UPSERTS_CSVUPLOAD,
                        register:           LocIP+import.meta.env.VITE_UPSERTS_REGISTER,

                    };

export const Uploads = {
                        users:              LocIP+import.meta.env.VITE_UPLOADS_USERS,
                        accounts:           LocIP+import.meta.env.VITE_UPLOADS_ACCOUNTS,
                        applications:       LocIP+import.meta.env.VITE_UPLOADS_APPS,
                        clubs:              LocIP+import.meta.env.VITE_UPLOADS_CLUBS,
                        unions:             LocIP+import.meta.env.VITE_UPLOADS_UNIONS,
                        uplines:            LocIP+import.meta.env.VITE_UPLOADS_UPLINES,
                        profile:            LocIP+import.meta.env.VITE_UPLOADS_PROFILE,
                        exchangerate:       LocIP+import.meta.env.VITE_UPLOADS_EXCHANGERATE,
                        images:             LocIP+import.meta.env.VITE_UPLOADS_IMAGES,
                        records:            LocIP+import.meta.env.VITE_UPLOADS_RECORDS,
                        recordsnew:         LocIP+import.meta.env.VITE_UPLOADS_RECORDSNEW,
                        recordz:            LocIP+import.meta.env.VITE_UPLOADS_RECORDZ,
                        register:           LocIP+import.meta.env.VITE_UPLOADS_REGISTER,
                        deals:              LocIP+import.meta.env.VITE_UPLOADS_DEALS,
                        controls:           LocIP+import.meta.env.VITE_UPLOADS_CONTROLS,
                        dealplayers:        LocIP+import.meta.env.VITE_UPLOADS_DEALPLAYERS,
                        dealuplines:        LocIP+import.meta.env.VITE_UPLOADS_DEALUPLINES,
                        dealformula:        LocIP+import.meta.env.VITE_UPLOADS_DEALFORMULA,
                        formula:            LocIP+import.meta.env.VITE_UPLOADS_FORMULA,
                        announcements:      LocIP+import.meta.env.VITE_UPLOADS_ANNOUNCE,
                    };

export const Images = {
                        users:                LocIP+import.meta.env.VITE_IMAGE_AVATARS,
                        applications:         LocIP+import.meta.env.VITE_IMAGE_APPS,
                        clubs:                LocIP+import.meta.env.VITE_IMAGE_CLUBS,
                        announcements:        LocIP+import.meta.env.VITE_IMAGE_ANNOUNCES,
                        unions:               LocIP+import.meta.env.VITE_IMAGE_UNIONS,
                        pictures:             LocIP+import.meta.env.VITE_IMAGE_PICTURES,
                    };
                    
                    
export const Path = {
                        icons:              "/images/icons/",
                        apps:               "/images/apps/",
                        clubs:              "/images/clubs/",
                        avatars:            "/images/avatars/",
                        logo:               "/images/logo/",
                        pictures:           "/images/pictures/"
                    };

export const unionType = [
                        {
                          key: 'PRIVATE',
                          text: 'PRIVATE',
                          value: 'PRIVATE',
                        },
                        {
                          key: 'PUBLIC',
                          text: 'PUBLIC',
                          value: 'PUBLIC',
                        },
                        {
                          key: 'UNION',
                          text: 'UNION',
                          value: 'UNION',
                        },
                      ]

export function LogOut(){
    window.location.replace("/login"); 
    window.location.href = "/login";
}


