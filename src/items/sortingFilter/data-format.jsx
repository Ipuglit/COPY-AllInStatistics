import * as Func from 'src/hooks/functions'

// ----------------------------------------------------------------------

export default function FormattingSorting(byItems,byWhat,byIDD,byName,byOther,byCapital) {
                                        //ITEMS,DEFAULT,IDD,NAME
    const defaulted =   [{
                            what:       byWhat,
                        }];

    const converted = byItems.map(i => {
                                    return {
                                            id:               i.increment,
                                            idd:              i[byIDD],
                                            label:            byCapital ? Func.wordCapital(i[byName]) : i[byName],
                                            value:            i[byName],
                                            other:            i[byOther] ? i[byOther] : "",
                                            what:             byWhat,
                                            };
                                    })

   const combining = ([...defaulted,...converted])

  return (combining);
}
