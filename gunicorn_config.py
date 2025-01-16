bind = "unix:/var/www/laherradura/fherradurafinal2/laherradura.sock"
workers = 2  
worker_class = 'sync'
max_requests = 1000
max_requests_jitter = 50
timeout = 120
worker_connections = 1000
accesslog = "/var/www/laherradura/fherradurafinal2/access.log"
errorlog = "/var/www/laherradura/fherradurafinal2/error.log"
forwarded_allow_ips = '*'
secure_scheme_headers = {'X-Forwarded-Proto': 'https'}
proxy_allow_ips = '*'
raw_env = [
    'DJANGO_SETTINGS_MODULE=sistema.settings'
]
