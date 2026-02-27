import math as m
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit

dWvl = 0.001


def Main():
    wvlList = []
    circList = []
    lastFound = 0.001

    for circumference in np.arange(1, 100, 1):
        circList.append(circumference)

        found = False
        # pi D = C => D = C / pi
        D = circumference / m.pi
        #2a^2 = D^2 => a = sqrt( D^2 / 2)
        # amplitude = 1/2 * a
        amplitude = 0.5 * m.sqrt( (D**2) / 2)

        for wavelength in np.arange(lastFound, 100, dWvl):
            arcLength = calc_arclength(amplitude, wavelength)
            if (circumference < (arcLength + 0.1) and circumference > (arcLength - 0.1)):
                wvlList.append(wavelength)
                lastFound = wavelength
                found = True
                break
        if not found:
                wvlList.append(0)
                wavelength = 0
        print(f"circ={circumference}, then A={amplitude}, wvl={wavelength}")


    # It's a line !!!!
    params = curve_fit(line, circList, wvlList)
    slope = params[0]

    print(f"slope = {slope}")
    # The slope is 0.86883832

    fit_xs = [1, 100]
    fit_ys = [line(1, slope), line(100, slope)]

    plt.plot(circList, wvlList)
    plt.plot(fit_xs, fit_ys)
    plt.show()


# ======================================================================================

def wave(A, wvl, x):
    return A * m.sin(((2*m.pi)/wvl) * x )

# def dydx(A, wvl, x):
#     return A * ((2*m.pi)/wvl) * m.cos(((2*m.pi)/wvl) * x)

# def arcpart(A, wvl, x):
#     return m.sqrt(1 + dydx(A, wvl, x))

def dy(A, wvl, x, dx):
    return wave(A, wvl, x + dx) - wave(A, wvl, x)

def arcpart(A, wvl, x, dx):
    return m.sqrt(dy(A, wvl, x, dx)**2 + dx**2)

# numerical solving of integral:

def calc_arclength(A, wvl):
    L = 0
    dx = wvl / 1000.0
    for x in np.arange(0.01, wvl, dx):
        L += arcpart(A, wvl, x, dx)
    return L


def line(x, slope):
    return slope * x




if __name__ == "__main__":
    Main()