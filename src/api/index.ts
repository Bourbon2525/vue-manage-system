import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './mock/table.json',
        method: 'get'
    });
};

export const fetchWebsiteData = () => {
    return request({
        url: 'http://localhost:1011/query_website',
        method: 'get'
    });
};

export const fetchDeleteWebsite = (id: any) => {
    return request({
        url: 'http://localhost:1011/delete',
        method: 'post',
        data: {
            id: id
        }
    });
}

export const fetchSaveWebsite = (id, important_level, is_allowed, country, count) => {
    return request({
        url: 'http://localhost:1011/save',
        method: 'post',
        data: {
            id: id,
            important_level: important_level,
            is_allowed: is_allowed,
            country: country,
            count: count
        }
    });
}

export const fetchUserData = () => {
    return request({
        url: './mock/user.json',
        method: 'get'
    });
};

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};
