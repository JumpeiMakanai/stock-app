import FeaturedPlayListOutlinedIcon from '@mui/icons-material/FeaturedPlayListOutlined'
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined'
import SsidChartOutlinedIcon from '@mui/icons-material/SsidChartOutlined'
import './index.css'
import { Tooltip } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'

import { IconButtonNormal } from '../../../Parts/MyMui'

export const Header = () => {
  const location = useLocation()
  const { hash, pathname, search } = location

  return (
    <div className="app-header">
      <header>
        <h1>stock&nbsp;stock</h1>
        <ul>
          {pathMap.map(({ path, name, icon }, i) => (
            <li key={i}>
              <Link to={path}>
                <HeaderButton title={name} shown={pathname == path}>
                  {icon}
                </HeaderButton>
              </Link>
            </li>
          ))}
        </ul>
      </header>
    </div>
  )
}

const pathMap = [
  {
    path: '/',
    name: '損益',
    icon: <SsidChartOutlinedIcon fontSize="inherit" />,
  },
  {
    path: '/history',
    name: '履歴',
    icon: <FeaturedPlayListOutlinedIcon fontSize="inherit" />,
  },
  {
    path: '/input',
    name: '追加',
    icon: <PlaylistAddOutlinedIcon fontSize="inherit" />,
  },
]

const HeaderButton = ({
  children,
  title,
  shown,
}: {
  children: any
  title: string
  shown: boolean
}) => {
  const showColorSet = {
    color: '#222244',
    backgroundColor: '#ddf',
  }

  const notShowColorSet = {
    color: '#ccf',
    backgroundColor: 'transparent',
  }

  return (
    <Tooltip title={title}>
      <IconButtonNormal
        size="small"
        sx={{
          ...(shown ? showColorSet : notShowColorSet),
        }}
      >
        {children}
      </IconButtonNormal>
    </Tooltip>
  )
}
