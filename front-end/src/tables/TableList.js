import Table from "./Table"

 export default function TableList({ tables, finish }) {
    const list = tables.map((obj) => <Table key={obj.table_name} table={obj} finish={finish} />);

    return (
        <table className='table table-hover'>
            <thead>
                <tr>
                    <th scope='col'>Table ID</th>
                    <th scope='col'>Table name</th>
                    <th scope='col'>Capacity</th>
                    <th scope='col'>Occupied</th>
                    <th scope='col'>Finish</th>
                </tr>
            </thead> 
            <tbody>
                {list}
            </tbody>
        </table>
    )
}