export interface TableItem {
    id?: number;  // id 是可选的
    website_path: string;
    important_level: number;
    is_allowed: boolean;
    country: string;
    count: number;
    thumb?: File; // 如果有上传文件
}