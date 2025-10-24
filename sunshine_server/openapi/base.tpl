{
  "openapi": "3.0.0",
  "info": {
    "description": "Documentation for sunshine API",
    "version": "1.0.0",
    "title": "Sunshine API",
    "contact": {
      "email": "p.penev@yatrusanalytics.com"
    }
  },
  "servers": [
    {
      "description": "Sunshine staging",
      "url": "https://staging-sunshine.acme.universe/"
    },
    {
      "description": "Sunshine production",
      "url": "https://sunshine.acme.universe/"
    }
  ],
  "tags": {{marshal .Tags}},
  "paths": {{marshal .Paths}},
  "components": {{marshal .Components}}
}
