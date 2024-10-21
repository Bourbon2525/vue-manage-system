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

export const fetchDeleteWebsite=()=> {
    return request({
        url: 'http://localhost:1011/delete_website',
        method: 'get'
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
