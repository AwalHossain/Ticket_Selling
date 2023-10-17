/* eslint-disable @typescript-eslint/no-explicit-any */



const searchFilter = (
    searchTerm: string | undefined,
    searchableFields: string[],
) => {
    const andCondition = ({
        OR: searchableFields.map((field) => ({
            [field]: {
                contains: searchTerm,
                mode: 'insensitive',
            },
        })),
    });

    return andCondition
}



type FilterOption = Record<string, any>;

type RelationalFieldMapper = Record<string, string>;

type Filter = {
    [key: string]: {
        equals: any;
    } | {
        [key: string]: {
            id: string;
        };
    };
};

const objectFilter = (filterOption: FilterOption, relationalFields: string[], relationalFieldMapper: RelationalFieldMapper): Filter[] => {
    const result = Object.keys(filterOption).map((key) => {
        if (relationalFields.includes(key)) {
            return {
                [relationalFieldMapper[key]]: {
                    id: filterOption[key]
                }
            };
        } else {
            return {
                [key]: {
                    equals: filterOption[key]
                }
            };
        }
    });

    return result;
};

const filterCondition = (filterData: any) => {
    const result = Object.keys(filterData).map((key) => (
        {
            [key]: {
                equals: (filterData as any)[key]
            }

        }

    ))
    return result;
}



export const FilterOption = {
    searchFilter,
    objectFilter,
    filterCondition
} 