export const operating_systems = {
    UNKNOWN: 0,
    WINDOWS: 1,
    LINUX: 2,
    OSX: 3
}

export function parse_os_from_user_agent(user_agent) {
    user_agent = user_agent.toLowerCase()

    if (/windows/.test(user_agent)) {
        return operating_systems.WINDOWS
    }
    else if (/linux|ubuntu/.test(user_agent)) {
        return operating_systems.LINUX
    }
    else if (/osx|os x|mac/.test(user_agent)) {
        return operating_systems.OSX
    }
    else {
        return operating_systems.UNKNOWN
    }
}
