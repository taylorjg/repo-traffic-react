import { version } from '../package.json'
import './Version.css'

const Version = () => {
  return (
    <span className="version">version: {version}</span>
  )
}

export default Version
