// src/pages/RoomManagement/components/RoomPagination.tsx
import React from 'react';
import { Pagination, PaginationProps } from 'antd';

// Kế thừa PaginationProps của Ant Design để có đầy đủ thuộc tính
interface RoomPaginationProps extends PaginationProps {
    // Bạn có thể thêm các props tùy chỉnh khác nếu cần
}

const RoomPagination: React.FC<RoomPaginationProps> = (props) => {
    return (
        <Pagination
            defaultCurrent={1}
            total={50} // Giá trị mặc định hoặc truyền từ props
            pageSize={10} // Giá trị mặc định hoặc truyền từ props
            style={{ marginTop: 24, textAlign: 'center' }}
            {...props} // Ghi đè các giá trị mặc định bằng props được truyền vào
        />
    );
};

export default RoomPagination;