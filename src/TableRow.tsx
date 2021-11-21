// created_at: "2017-09-07T17:15:54Z"
// description: "Exercises from Advanced Scala with Cats"
// forks_count: 0
// html_url: "https://github.com/taylorjg/AdvancedScala"
// id: 102765134
// language: "Scala"
// name: "AdvancedScala"
// stargazers_count: 1
// updated_at: "2018-12-05T21:08:39Z"

const TableRow: React.FC<{
  item: {
    repo: {
      id: number,
      name: string,
      forks_count: number,
      stargazers_count: number
    }
  }
}> = ({ item }) => {
  return (
    <tr>
      <td>{item.repo.name}</td>
      <td>{item.repo.forks_count}</td>
      <td>{item.repo.stargazers_count}</td>
    </tr>
  )
}

export default TableRow
