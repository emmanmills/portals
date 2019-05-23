import { Link } from 'react-router-dom'
import * as React from 'react'
import routesConfig from './config/routesConfig'
import { GenericRoute, SynapseObject } from './types/portal-config'
import logoHeaderConfig from './config/logoHeaderConfig'
import Modal from '@material-ui/core/Modal'
import { SynapseComponents, SynapseClient, SynapseConstants } from 'synapse-react-client'
import UserCard from 'synapse-react-client/dist/containers/UserCard'
import * as AppInitializer from './AppInitializer'

export type NavbarState = {
  token: string | undefined,
  userprofile: any,
  [index:string]: any
}
export class Navbar extends React.Component<{}, NavbarState> {

  constructor(props: any) {
    super(props)
    const numNestedRoutes = routesConfig.filter(el => el.isNested).length
    const state: NavbarState = {
      numNestedRoutes,
      userprofile: undefined,
      token: undefined,
      showLoginDialog: false
    }
    for (let i = 0; i < numNestedRoutes; i += 1) {
      state[`dropdown${i}`] = false
    }
    this.state = state
  }

  // Toggle the dropdown menu, if index === -1 all the dropdown menus will close
  toggleDropdown = (index: number) => (_event: any) => {
    for (let i = 0; i < this.state.numNestedRoutes; i += 1) {
      const key = `dropdown${i}`
      if (index === -1) {
        this.setState({
          [key]: false,
          hasDropdownOpen: false
        })
      } else if (index === i) {
        this.setState({
          hasDropdownOpen: !this.state[key],
          [key]: !this.state[key]
        })
      }
    }
  }

  onSignIn = (event: any) => {
    this.setState({
      showLoginDialog: true
    })
  }
  // given the hash, decide if the link should have a bottom border
  getBorder = (name: string) => {
    if (name === '') {
      // special case the home page
      return
    }
    const hash = window.location.hash.substring(2)
    return hash.includes(name) ? 'bottom-border' : ''
  }
  componentDidMount() {
    this.getUserProfile()
  }
  componentDidUpdate() {
    this.getUserProfile()
  }
  getUserProfile = () => {
    const newToken = this.context
    if (newToken && (!this.state.userprofile || this.state.token !== newToken)) {
      SynapseClient.getUserProfile(newToken, 'https://repo-prod.prod.sagebase.org').then((profile: any) => {
        if (profile.profilePicureFileHandleId) {
          profile.preSignedURL = `https://www.synapse.org/Portal/filehandleassociation?associatedObjectId=${profile.ownerId}&associatedObjectType=UserProfileAttachment&fileHandleId=${profile.profilePicureFileHandleId}`
        }
        this.setState({
          userprofile: profile,
          token: newToken
        })
      }).catch((_err) => {
        console.log('user profile could not be fetched ', _err)
      })
    }
  }

  render() {
    const goToTop = (_event:any) => { window.scroll({ top: 0 }) }
    const { hasDropdownOpen } = this.state
    const toggleOff = this.toggleDropdown(-1)
    let currentNestedRouteCount = 0
    const { name, icon } = logoHeaderConfig
    const logo = name ? name : <img className="nav-logo" src={icon} />
    const { userprofile } = this.state
    return (
      <React.Fragment>
        <nav className="flex-display nav">
          {
            hasDropdownOpen
            &&
            <span onClick={toggleOff} className="menu-wall hand-cursor"/>
          }
          <div className="center-content nav-logo-container">
            {/* TODO - this may be an img tag which will require a change */}
            <Link onClick={goToTop} to="/" id="home-link"> {logo} </Link>
          </div>
          <div className="nav-link-container">
            {
              !userprofile &&
              <div className="center-content nav-button">
                  <button
                    id="signin-button"
                    className="SRC-primary-text-color-background"
                    onClick={this.onSignIn}
                  >
                    SIGN&nbsp;IN
                  </button>
                  <Modal open={this.state.showLoginDialog}>
                    <SynapseComponents.Login
                        token={this.state.token}
                        theme={'light'}
                        icon={true}
                    />
                  </Modal>
                </div>
            }
            {
                userprofile &&
                <div className="center-content nav-button">
                  <div className={'dropdown nav-button-container'}>
                    <div className="center-content nav-button hand-cursor">
                      <UserCard
                        userProfile={userprofile}
                        size={SynapseConstants.SMALL_USER_CARD}
                        preSignedURL={userprofile.preSignedURL}
                      />
                    </div>
                      <a
                        href={`https://www.synapse.org/#!Profile:${userprofile.ownerId}/projects`}
                        // tslint:disable-next-line:max-line-length
                        className="dropdown-link SRC-primary-background-color-hover SRC-nested-color center-content"
                      >
                        Projects
                      </a>
                  </div>
                </div>
            }
            {
              // we have to loop backwards due to css rendering of flex-direction: row-reverse
              routesConfig.slice().reverse().map(
                (el) => {
                  const displayName = el.displayName ? el.displayName : el.name
                  if (el.isNested) {
                    // handle the case when the menu has sub options
                    const plainRoutes = el.routes as GenericRoute []
                    const key = `dropdown${currentNestedRouteCount}`
                    const isCurrentDropdownOpen = this.state[key]
                    const toggleDropdown = this.toggleDropdown(currentNestedRouteCount)
                    currentNestedRouteCount += 1
                    return (
                      <div key={el.name} className={`dropdown nav-button-container ${isCurrentDropdownOpen ? 'open' : ''} ${this.getBorder(el.name)}`}>
                        <div onClick={toggleDropdown} className="center-content nav-button hand-cursor"> {displayName} </div>
                        {
                          isCurrentDropdownOpen &&
                            <div className="dropdown-menu">
                              {
                                plainRoutes.map(
                                  (route) => {
                                    const routeDisplayName = route.displayName ? route.displayName : route.name
                                    return (<Link
                                      key={route.name}
                                      onClick={toggleDropdown}
                                      className="dropdown-link SRC-primary-background-color-hover SRC-nested-color center-content"
                                      to={route.to!}
                                    >
                                      {routeDisplayName}
                                    </Link>)
                                  }
                                )
                              }
                            </div>
                        }
                      </div>
                    )
                  }
                  return (
                    <Link key={el.name} className={`center-content nav-button nav-button-container ${this.getBorder(el.name)}`} to={el.to}> {displayName} </Link>
                  )
                }
              )
            }
          </div>
        </nav>
        <div className="spacer"/>
      </React.Fragment>
    )
  }
}
Navbar.contextType = AppInitializer.TokenContext
