const validateByRequest = (requestTime) => {

    //  Checking day type and company hours active
    const dayType = requestTime.dayType;
    const fromTimeOfDay = requestTime.fromTimeOfDay;
    const toTimeOfDay = requestTime.toTimeOfDay;

    switch ( dayType ) {
        case 'ANY':
            let currentHour = new Date().getHours();
            if (currentHour <= fromTimeOfDay || currentHour >= toTimeOfDay ) {
                return res.status(200).json({
                    message: "Not available at this hour",
                });
            }
            break;
        case 'BUSINESS':
            if (!checkDay) {
                //let currentHour = new Date().getHours();
                let currentHour = 11;
                if (currentHour <= fromTimeOfDay || currentHour >= toTimeOfDay ) {
                    return res.status(200).json({
                        message: "Not available at this hour",
                    });
                }
            } else {
                return res.status(200).json({
                    message: "NOT A BUSINESS DAY",
                });
            }
            break;
        case 'NON-BUSINESS':
        case 'WEEKEND':
            return res.status(200).json({
                message: "NOT FOR NOW",
            });
            break;
        default:
            break;
    }

}


module.exports = validateByRequest;


/*
  //  Checking day type and company hours active
        const dayType = rules.availability.byRequestTime.dayType;
        const fromTimeOfDay = rules.availability.byRequestTime.fromTimeOfDay;
        const toTimeOfDay = rules.availability.byRequestTime.toTimeOfDay;

        switch ( dayType ) {
            case 'ANY':
                let currentHour = new Date().getHours();
                if (currentHour <= fromTimeOfDay || currentHour >= toTimeOfDay ) {
                    return res.status(200).json({
                        message: "Not available at this hour",
                    });
                }
                break;
            case 'BUSINESS':
                if (!checkDay) {
                    //let currentHour = new Date().getHours();
                    let currentHour = 11;
                    if (currentHour <= fromTimeOfDay || currentHour >= toTimeOfDay ) {
                        return res.status(200).json({
                            message: "Not available at this hour",
                        });
                    }
                } else {
                    return res.status(200).json({
                        message: "NOT A BUSINESS DAY",
                    });
                }
                break;
            case 'NON-BUSINESS':
            case 'WEEKEND':
                return res.status(200).json({
                    message: "NOT FOR NOW",
                });
                break;
            default:
                break;
        }


*/