import { StyledVersion} from "./Version.styles";
import { version } from '../package.json'

const Version = () => {
  return (
    <StyledVersion>version: {version}</StyledVersion>
  )
}

export default Version
