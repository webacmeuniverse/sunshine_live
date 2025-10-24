package controller

import (
	"context"
	"testing"

	"acme.universe/sunshine/sunshine/services"
	"acme.universe/sunshine/sunshine/stores"
	"github.com/jinzhu/gorm"
)

func TestAddEUROBOR(t *testing.T) {
	env := services.NewTestEnv(t)
	contr := NewGlobal(env)
	db := env.DB

	anm := stores.NewTestAdminNwManager(t, env.UserStore)
	pfm := stores.NewTestPlatformManager(t, env.UserStore)
	u := stores.NewTestUser(t, env.UserStore)

	seed(t, db)

	cases := []struct {
		name  string
		ctx   context.Context
		value float64
		err   error
	}{
		{
			name:  "anm",
			value: 13,
			ctx:   services.NewTestContext(t, env, anm),
		},
		{
			name:  "pfm",
			value: 7,
			ctx:   services.NewTestContext(t, env, pfm),
		},
		{
			name:  "random u",
			value: 2,
			ctx:   services.NewTestContext(t, env, u),
			err:   ErrUnauthorized,
		},
	}

	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			if err := contr.AddEUROBOR(c.ctx, c.value); err != c.err {
				t.Fatalf("error occurred: %v but exp: %v", err, c.err)
			}

			if c.err != nil {
				return
			}

			var e eurobor
			db.Table("eurobor").Find(&e)

			if e.Value != c.value {
				t.Fatalf("count exp: %v, got: %v", c.value, e.Value)
			}
		})
	}
}

type eurobor struct {
	Value float64
}

func seed(t *testing.T, db *gorm.DB) {
	for i := range []int{1, 2, 3} {
		v := 1.3 * float64(i)

		db.Table("eurobor").Save(&eurobor{Value: v})
	}
}
